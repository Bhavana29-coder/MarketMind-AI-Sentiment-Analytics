import { useState, useEffect } from "react";
import axios from "axios";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";

function App() {

  const [company, setCompany] = useState("");
  const [industry, setIndustry] = useState("");
  const [text, setText] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [industryFilter, setIndustryFilter] = useState("");

  const [result, setResult] = useState(null);
  const [records, setRecords] = useState([]);

  const [editingId, setEditingId] = useState(null);

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

    setCompany("");
    setIndustry("");
    setText("");

    loadRecords();
  };

  const deleteRecord = async (id) => {

    await axios.delete(
      `http://127.0.0.1:8000/records/${id}`
    );

    loadRecords();
  };

  const editRecord = (record) => {

    setCompany(record.company);
    setIndustry(record.industry);

    setEditingId(record.id);
  };

  const updateRecord = async () => {

    await axios.put(
      `http://127.0.0.1:8000/records/${editingId}`,
      {
        company,
        industry
      }
    );

    setCompany("");
    setIndustry("");

    setEditingId(null);

    loadRecords();
  };
const exportCSV = () => {

  window.open(
    "http://127.0.0.1:8000/export",
    "_blank"
  );

};
  const totalRecords = records.length;

  const positiveCount = records.filter(
    record => record.sentiment === "Positive"
  ).length;

  const negativeCount = records.filter(
    record => record.sentiment === "Negative"
  ).length;

  const pieData = [
    {
      name: "Positive",
      value: positiveCount
    },
    {
      name: "Negative",
      value: negativeCount
    }
  ];

  const barData = records.map(record => ({
    company: record.company,
    score: record.score
  }));

  const filteredRecords = records.filter(record => {

    const companyMatch =
      record.company
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const industryMatch =
      industryFilter === "" ||
      record.industry === industryFilter;

    return companyMatch && industryMatch;
  });

  return (
    <div className="container mt-4">

      <h1 className="text-center mb-4">
        MarketMind Dashboard
      </h1>

      {/* Summary Cards */}

      <div className="row mb-4">

        <div className="col-md-4">
          <div className="card text-center">
            <div className="card-body">
              <h5>Total Records</h5>
              <h2>{totalRecords}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card text-center">
            <div className="card-body">
              <h5>Positive News</h5>
              <h2>{positiveCount}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card text-center">
            <div className="card-body">
              <h5>Negative News</h5>
              <h2>{negativeCount}</h2>
            </div>
          </div>
        </div>

      </div>

      {/* Pie Chart */}

      <div className="mb-5">

        <h2>Sentiment Distribution</h2>

        <PieChart width={400} height={300}>

          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            outerRadius={100}
            dataKey="value"
            label
          >
            <Cell fill="#28a745" />
            <Cell fill="#dc3545" />
          </Pie>

          <Tooltip />
          <Legend />

        </PieChart>

      </div>

      {/* Bar Chart */}

      <div className="mb-5">

        <h2>Company Sentiment Scores</h2>

        <BarChart
          width={900}
          height={400}
          data={barData}
        >
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="company" />

          <YAxis />

          <Tooltip />

          <Bar
            dataKey="score"
            fill="#0d6efd"
          />

        </BarChart>

      </div>

      {/* Form */}

      <input
        className="form-control mb-3"
        placeholder="Company Name"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
      />

      <input
        className="form-control mb-3"
        placeholder="Industry"
        value={industry}
        onChange={(e) => setIndustry(e.target.value)}
      />

      <textarea
        className="form-control mb-3"
        rows="4"
        placeholder="Enter Market News"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      {editingId ? (
        <button
          className="btn btn-warning mb-4"
          onClick={updateRecord}
        >
          Update Record
        </button>
      ) : (
        <button
          className="btn btn-success mb-4"
          onClick={analyzeSentiment}
        >
          Analyze Sentiment
        </button>
      )}

      {/* Latest Result */}

      {result && (

        <div className="mb-4">

          <h3>Latest Result</h3>

          <p>
            <strong>Sentiment:</strong> {result.sentiment}
          </p>

          <p>
            <strong>Score:</strong> {result.score}
          </p>

        </div>
      )}

      <hr />

      {/* Search */}

      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search Company..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Filter */}

      <select
        className="form-select mb-3"
        value={industryFilter}
        onChange={(e) => setIndustryFilter(e.target.value)}
      >

        <option value="">
          All Industries
        </option>

        {[...new Set(
          records
            .map(r => r.industry)
            .filter(
              industry =>
                industry &&
                industry.trim() !== ""
            )
        )].map(industry => (

          <option
            key={industry}
            value={industry}
          >
            {industry}
          </option>

        ))}

      </select>
      <button
  className="btn btn-success mb-3"
  onClick={exportCSV}
>
  Export CSV
</button>
      {/* Table */}

      <h2>Sentiment History</h2>

      <table className="table table-striped table-bordered mt-3">

        <thead>

          <tr>
            <th>Company</th>
            <th>Industry</th>
            <th>Sentiment</th>
            <th>Score</th>
            <th>Action</th>
          </tr>

        </thead>

        <tbody>

          {filteredRecords.map((record) => (

            <tr key={record.id}>

              <td>{record.company}</td>

              <td>{record.industry}</td>

              <td>

                {record.sentiment === "Positive" && (
                  <span className="badge bg-success">
                    Positive
                  </span>
                )}

                {record.sentiment === "Negative" && (
                  <span className="badge bg-danger">
                    Negative
                  </span>
                )}

                {record.sentiment === "Neutral" && (
                  <span className="badge bg-warning text-dark">
                    Neutral
                  </span>
                )}

              </td>

              <td>{record.score}</td>

              <td>

                <button
                  className="btn btn-primary btn-sm me-2"
                  onClick={() => editRecord(record)}
                >
                  Edit
                </button>

                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => deleteRecord(record.id)}
                >
                  Delete
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}

export default App;