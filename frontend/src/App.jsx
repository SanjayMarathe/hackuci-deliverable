import { useState, useEffect } from "react";
import { Snackbar, Alert } from "@mui/material";
import "./App.css";
import QuoteItem from "./QuoteItem";
import quotebookLogo from "./images/quotebook.png";

function App() {
	const [quotes, setQuotes] = useState([]);
	const [maxAge, setMaxAge] = useState("all");
	const [name, setName] = useState("");
	const [message, setMessage] = useState("");
	const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

	useEffect(() => {
		fetchQuotes();
	}, [maxAge]);

	const fetchQuotes = async () => {
		try {
			const url = maxAge === "all" 
				? "/api/quotes" 
				: `/api/quotes?max_age=${maxAge}`;
			const response = await fetch(url);
			if (!response.ok) {
				const errorMessage = `Failed to fetch quotes: ${response.status} ${response.statusText}`;
				setSnackbar({ open: true, message: errorMessage, severity: "error" });
				return;
			}
			const data = await response.json();
			setQuotes(data.quotes || []);
		} catch (error) {
			setSnackbar({ open: true, message: `Error fetching quotes: ${error.message}`, severity: "error" });
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const formData = new FormData();
		formData.append("name", name);
		formData.append("message", message);
		
		try {
			const response = await fetch("/api/quote", {
				method: "POST",
				body: formData
			});
			if (response.ok) {
				setName("");
				setMessage("");
				setSnackbar({ open: true, message: "Quote submitted successfully!", severity: "success" });
				await fetchQuotes();
			} else {
				const errorText = await response.text();
				setSnackbar({ open: true, message: `Failed to submit quote: ${response.status} ${errorText}`, severity: "error" });
			}
		} catch (error) {
			setSnackbar({ open: true, message: `Error submitting quote: ${error.message}`, severity: "error" });
		}
	};

	const handleCloseSnackbar = (event, reason) => {
		if (reason === "clickaway") {
			return;
		}
		setSnackbar({ ...snackbar, open: false });
	};


	return (
		<div className="App">
			<img src={quotebookLogo} alt="Quote Book Logo" className="logo" />
			<h1>Hack at UCI Tech Deliverable</h1>

			<h2>Submit a quote</h2>
			<form onSubmit={handleSubmit}>
				<label htmlFor="input-name">Name</label>
				<input 
					type="text" 
					name="name" 
					id="input-name" 
					value={name}
					onChange={(e) => setName(e.target.value)}
					required 
				/>
				<label htmlFor="input-message">Quote</label>
				<input 
					type="text" 
					name="message" 
					id="input-message" 
					value={message}
					onChange={(e) => setMessage(e.target.value)}
					required 
				/>
				<button type="submit">Submit</button>
			</form>

			<h2>Previous Quotes</h2>
			<label htmlFor="quote-filter">Filter by age:</label>
			<select 
				id="quote-filter" 
				value={maxAge} 
				onChange={(e) => setMaxAge(e.target.value)}
			>
				<option value="all">All</option>
				<option value="week">Last Week</option>
				<option value="month">Last Month</option>
				<option value="year">Last Year</option>
			</select>
			<div className="messages">
				{quotes.map((quote, index) => (
					<QuoteItem key={index} quote={quote} />
				))}
			</div>
			<Snackbar
				open={snackbar.open}
				autoHideDuration={6000}
				onClose={handleCloseSnackbar}
				anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
			>
				<Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
					{snackbar.message}
				</Alert>
			</Snackbar>
		</div>
	);
}

export default App;
