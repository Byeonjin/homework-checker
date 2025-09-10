import HomeworkChecker from "./CounterSection";

function App() {
  return (
    <>
      <h1
        style={{
          color: "#32302C",
          fontSize: "24px",
          margin: "20px 8px 8px 8px",
        }}
      >
        PROBLEM SOLVING
      </h1>
      <section>
        <div
          className="user-list-item-wrapper"
          style={{ display: "flex", flexDirection: "row" }}
        >
          <HomeworkChecker owner="Byeonjin" repo="plantCodingTestGrass" />
          <HomeworkChecker owner="coding-frog117" repo="Programmers" />
          <HomeworkChecker owner="annyoon" repo="ps" />
          <HomeworkChecker owner="PIGMONGKEY" repo="Algorithm" />
        </div>
      </section>
    </>
  );
}

export default App
