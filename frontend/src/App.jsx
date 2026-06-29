import "./App.css";
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
import {
  LineChart,
  Line,
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
  const [darkMode, setDarkMode] = useState(true);
  const loadRecords = async () => {
  try {
    const response = await axios.get(
      "http://127.0.0.1:8000/records"
    );

    setRecords(
      Array.isArray(response.data)
        ? response.data
        : []
    );
  } catch (error) {
    console.error(error);
    setRecords([]);
  }
};

  useEffect(() => {

  if (darkMode) {
    document.body.classList.remove("light-mode");
  } else {
    document.body.classList.add("light-mode");
  }

}, [darkMode]);
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
  const highestScore =
  records.length > 0
    ? Math.max(...records.map(r => r.score))
    : 0;

const mostPositiveCompany =
  records.length > 0
    ? records.reduce((a, b) =>
        a.score > b.score ? a : b
      ).company
    : "N/A";

const industryCount = {};

records.forEach(record => {
  industryCount[record.industry] =
    (industryCount[record.industry] || 0) + 1;
});

const mostActiveIndustry =
  Object.keys(industryCount).length > 0
    ? Object.keys(industryCount).reduce(
        (a, b) =>
          industryCount[a] > industryCount[b]
            ? a
            : b
      )
    : "N/A";
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
  const trendData = records.map((record) => ({
  date: record.created_at
    ? record.created_at.split(" ")[0]
    : "N/A",
  score: record.score || 0
}));
  const industryData = Object.entries(

  records.reduce((acc, record) => {

    acc[record.industry] =
      (acc[record.industry] || 0) + 1;

    return acc;

  }, {})

).map(([industry, count]) => ({

  industry,
  count

}));
  const filteredRecords = records.filter(record => {

    const companyMatch =
      (record.company || "")
  .toLowerCase()
  .includes(searchTerm.toLowerCase());
        

    const industryMatch =
      industryFilter === "" ||
      record.industry === industryFilter;

    return companyMatch && industryMatch;
  });

  return (
    <>
    <button
    className="theme-toggle"
    onClick={() => setDarkMode(!darkMode)}
  >
    {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
  </button>

  <div className="container mt-4">
{/* <div className={`container mt-4 ${darkMode ? "dark-theme" : "light-theme"}`}> */}

     <div className="text-center mb-5">
<div className="dashboard-header">
 
  <div className="logo-box">
  <img
    src="/logo.png"
    alt="MarketMind Logo"
    className="logo-img"
  />
</div>
 <h1 className="dashboard-title">
MarketMind
</h1>
 <h4 className="dashboard-subtitle">
    AI-Powered Market Sentiment Analytics
  </h4>
</div>
</div> 

      {/* Summary Cards */}
<div className="row g-4 mb-5">

  <div className="col-md-4">
    <div className="kpi-card kpi-blue">
      <h5>Total Records</h5>
      <h2>{totalRecords}</h2>
    </div>
  </div>

  <div className="col-md-4">
    <div className="kpi-card kpi-green">
      <h5>Positive News</h5>
      <h2>{positiveCount}</h2>
    </div>
  </div>

  <div className="col-md-4">
    <div className="kpi-card kpi-red">
      <h5>Negative News</h5>
      <h2>{negativeCount}</h2>
    </div>
  </div>

  <div className="col-md-4">
    <div className="kpi-card kpi-purple">
      <h5>Most Positive Company</h5>
      <h2>{mostPositiveCompany}</h2>
    </div>
  </div>

  <div className="col-md-4">
    <div className="kpi-card kpi-orange">
      <h5>Highest Score</h5>
      <h2>{highestScore.toFixed(2)}</h2>
    </div>
  </div>

  <div className="col-md-4">
    <div className="kpi-card kpi-cyan">
      <h5>Most Active Industry</h5>
      <h2>{mostActiveIndustry}</h2>
    </div>
  </div>

</div>
    
      {/* Pie Chart */}

    <div className="chart-box pie-chart-container">
        <h2 className="section-title">
  Sentiment Distribution
</h2>
        <PieChart width={550} height={350}>

          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            outerRadius={120}
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

      <div className="chart-box text-center">

       <h2 className="section-title">
       Company Sentiment Scores
</h2>

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
<div className="chart-box">

<h2 className="section-title">
Sentiment Trend Over Time
</h2>

<LineChart
  width={900}
  height={400}
  data={trendData}
>
    <CartesianGrid strokeDasharray="3 3" />

    <XAxis dataKey="date" />

    <YAxis />

    <Tooltip />

    <Line
      type="monotone"
      dataKey="score"
      stroke="#198754"
    />

  </LineChart>
</div >
 
<div className="chart-box">

<h2 className="section-title">
Industry-wise News Count
</h2>

<BarChart
  width={900}
  height={400}
  data={industryData}
>

    <CartesianGrid strokeDasharray="3 3" />

    <XAxis dataKey="industry" />

    <YAxis />

    <Tooltip />

    <Bar
      dataKey="count"
      fill="#20c997"
    />

  </BarChart>

</div>

      {/* Form */}

<div className="news-form">

 
    <h2 className="section-title">
      Add Market News
</h2>

    <input
      type="text"
      className="form-control mb-3"
      placeholder="Company Name"
      value={company}
      onChange={(e) => setCompany(e.target.value)}
    />

    <input
      type="text"
      className="form-control mb-3"
      placeholder="Industry"
      value={industry}
      onChange={(e) => setIndustry(e.target.value)}
    />

    <textarea
      className="form-control mb-3"
      rows="5"
      placeholder="Enter Market News"
      value={text}
      onChange={(e) => setText(e.target.value)}
    />

    {editingId ? (
      <button
        className="btn btn-success"
        onClick={updateRecord}
      >
        Update Record
      </button>
    ) : (
      <button
        className="btn btn-primary"
        onClick={analyzeSentiment}
      >
        Analyze Sentiment
      </button>
    )}

  </div>



      {/* Latest Result */}

      {result && (

  <div className="alert alert-info mt-3">

    <h4>Latest Result</h4>

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

      <h2 className="section-title">
  Sentiment History
</h2>

    <table className="table custom-table mt-3">

        <thead>

          <tr>
            <th>Date</th>
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
              <td>
  {record.created_at}
</td>
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
</>
);
}


export default App;

