import { useState, useEffect } from "react";
import "./App.css";
import QuoteItem from "./QuoteItem";

function App() {
	const [quotes, setQuotes] = useState([]);
	const [maxAge, setMaxAge] = useState("all");
	const [name, setName] = useState("");
	const [message, setMessage] = useState("");

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
				console.error("Failed to fetch quotes:", response.status, response.statusText);
				return;
			}
			const data = await response.json();
			setQuotes(data.quotes || []);
		} catch (error) {
			console.error("Error fetching quotes:", error);
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
				await fetchQuotes();
			}
		} catch (error) {
			console.error("Error submitting quote:", error);
		}
	};


	return (
		<div className="App">
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
		</div>
	);
}

export default App;
