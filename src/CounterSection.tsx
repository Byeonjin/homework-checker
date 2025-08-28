import { useEffect, useState } from "react";
import "./CounterSection.css";
import CodeIcon from "./assets/code_gray.svg"

type Commit = {
  sha: string;
  commit: {
    author: {
      name: string;
      email: string;
      date: string;
    };
    message: string;
  };
  html_url: string;
};

interface HomeworkCheckerProps {
  owner: string; 
  repo: string; 
  minCount?: number; 
}

export default function HomeworkChecker({
  owner,
  repo,
  minCount = 3,
}: HomeworkCheckerProps) {
  const [count, setCount] = useState<number>(0);
  const [warning, setWarning] = useState<boolean>(false);
  const [commitDataArray, setCommitDataArray] = useState<Commit[]>([]);
  const [userProfileSrc, setUserProfileSrc] = useState<string>("");

  const extractLevelTag = (text: string) => {
    const m = text.match(/\[(level\s*1)\]/i);
    return m ? m[1].toLowerCase() : null;
  }

  const extractTitleContentRegex = (text: string) => {
    const m = text.match(/Title:\s*(.+)/);
    return m ? m[1].trim() : null;
  };

  useEffect(() => {
    async function fetchCommits() {
      try {
        const today = new Date();
        const day = today.getDay();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - (day === 0 ? 6 : day - 1));
        startOfWeek.setHours(0, 0, 0, 0);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);

        const since = startOfWeek.toISOString();
        const until = endOfWeek.toISOString();

        const res = await fetch(
          `https://api.github.com/repos/${owner}/${repo}/commits?since=${since}&until=${until}&per_page=100`
        );
        const userInfoRes = await fetch(`https://api.github.com/users/${owner}`);
        if (!res.ok || !userInfoRes.ok) {
          console.error("GitHub API 요청 실패", res.status);
          return;
        }



        const data: Commit[] = await res.json();

        const userInfoData = await userInfoRes.json();

        setUserProfileSrc(userInfoData.avatar_url ?? "");
        
        const weeklyCount = data.filter((commit) => {

          const isCommittedByBaekjoonHub =
            commit.commit.message.includes("BaekjoonHub");

          if (!isCommittedByBaekjoonHub) {
            return false;
          }
          
          const commitDate = new Date(commit.commit.author.date);
          return commitDate >= startOfWeek && commitDate <= endOfWeek;
        }).length;

        setCount(weeklyCount);
        setWarning(weeklyCount < minCount);
        setCommitDataArray(data)
      } catch (error) {
        console.error("데이터 가져오기 실패", error);
      }
    }

    fetchCommits();
  }, [owner, repo, minCount]);

  return (
    <div
      style={{
        padding: "8px 16px",
        margin: "8px",
        width: "100%",
        height: "calc(100vh - 110px)",
        border: "1px solid rgba(55, 53, 47, 0.16)",
        borderRadius: "6px",
        flexGrow: 1,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "6px",
            marginTop: "8px",
            marginBottom: "8px"
          }}
        >
          <div style={{ height: "25px", width: "25px", borderRadius: "15px", overflow:'hidden' }}>
            <img src={userProfileSrc ?? ""} height={"25px"} width={"25px"}  />
          </div>
          <h2 style={{ color: "rgb(50, 48, 44)", fontSize: "20px", margin: 0 }}>
            {owner}
          </h2>
        </div>
        <div
          style={{
            color: "rgb(50, 48, 44)",
            fontSize: "13px",
            backgroundColor: "rgba(28, 19, 1, 0.11)",
            padding: "2px 6px",
            borderRadius: "3px",
            width: "fit-content",
          }}
        >
          이번 주에 풀이한 문제 수: {count}
        </div>
      </div>
      {warning && (
        <div>
          <p style={{ color: "#ff7f50" }}>💸 이번 주 {minCount}문제 미만! 💸</p>
        </div>
      )}
      <ul style={{ margin: "0px", padding: "0px" }}>
        {commitDataArray.map((commit: Commit, idx: number) => {
          const commitMessage = commit.commit.message.split(",")[0] ?? "";

          const level = extractLevelTag(commitMessage);
          const title = extractTitleContentRegex(commitMessage);

          return (
            <a
              href={`${commit.html_url}`}
              key={`${commit.html_url}-${idx}`}
              className="link-box"
              style={{
                display: "block",
                padding: "8px 12px",
                borderRadius: "6px",
                border: "1px solid rgba(28, 19, 1, 0.11)",
                boxShadow: "rgba(25, 25, 25, 0.05) 0px 4px 12px 0px",
                marginBottom: "16px",
                textDecoration: "none",
                transition: "background-color 0.4s ease",
              }}
              target="_blank"
            >
              <div
                style={{
                  paddingTop: "4px",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <img src={CodeIcon} alt="code icon" height={"20px"} />
                <div
                  style={{
                    color: "rgb(76, 76, 76)",
                    paddingTop: "2px",
                    fontSize: "16px",
                    fontWeight: "600",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis"
                  }}
                >
                  {title !== null
                    ? title
                    : commit.commit.message.split(",")[0] ?? ""}
                </div>
              </div>
              {level && (
                <div
                  style={{
                    color: "rgb(50, 48, 44)",
                    backgroundColor: "rgba(28, 19, 1, 0.11)",
                    margin: "10px 4px 0px 0px",
                    padding: "2px 6px",
                    borderRadius: "3px",
                    width: "fit-content",
                    fontSize: "12px",
                  }}
                >
                  {level}
                </div>
              )}
              <div
                style={{
                  color: "rgb(50, 48, 44)",
                  margin: "12px 4px 4px 0px",
                  padding: "2px",
                  width: "fit-content",
                  fontSize: "12px",
                }}
              >{`풀이 날짜: ${new Date(
                commit.commit.author.date
              ).toLocaleDateString()}`}</div>
            </a>
          );
        })}
      </ul>
    </div>
  );
}
