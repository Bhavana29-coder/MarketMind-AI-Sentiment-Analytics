import { useState, useEffect } from "react";
import axios from "axios";

function App() {

  const [company, setCompany] = useState("");
  const [industry, setIndustry] = useState("");
  const [text, setText] = useState("");

  const [result, setResult] = useState(null);
  const [records, setRecords] = useState([]);

  const loadRecords = async () => {
    const response = await axios.get(
      "http://127.0.0.1:8000/records"
    );

    setRecords(response.data);
  };

  useEffect(() => {
    loadRecords();
  }, []);

  const analyzeSentiment = async () => {

    const response = await axios.post(
      "http://127.0.0.1:8000/sentiment",
      {
        company,
        industry,
        text
      }
    );

    setResult(response.data);

    loadRecords();
  };

  return (
    <div style={{ padding: "30px" }}>

      <h1>MarketMind</h1>

      <input
        placeholder="Company Name"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
      />

      <br /><br />

      <input
        placeholder="Industry"
        value={industry}
        onChange={(e) => setIndustry(e.target.value)}
      />

      <br /><br />

      <textarea
        rows="5"
        cols="50"
        placeholder="Enter Market News"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <br /><br />

      <button onClick={analyzeSentiment}>
        Analyze Sentiment
      </button>

      {result && (
        <div>
          <h2>Latest Result</h2>

          <p>
            Sentiment: {result.sentiment}
          </p>

          <p>
            Score: {result.score}
          </p>
        </div>
      )}

      <hr />

      <h2>Sentiment History</h2>

      <table border="1" cellPadding="10">

        <thead>
          <tr>
            <th>Company</th>
            <th>Industry</th>
            <th>Sentiment</th>
            <th>Score</th>
          </tr>
        </thead>

        <tbody>

          {records.map((record) => (

            <tr key={record.id}>

              <td>{record.company}</td>

              <td>{record.industry}</td>

              <td>{record.sentiment}</td>

              <td>{record.score}</td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}

export default App;