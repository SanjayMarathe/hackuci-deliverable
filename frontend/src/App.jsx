import { useState, useEffect } from "react";
import "./App.css";

function App() {
	const [quotes, setQuotes] = useState([]);
	const [maxAge, setMaxAge] = useState("all");
	const [name, setName] = useState("");
	const [message, setMessage] = useState("");

	useEffect(() => {
		fetchQuotes();
	}, [maxAge]);

	const fetchQuotes = async () => {
		const url = maxAge === "all" 
			? "/api/quotes" 
			: `/api/quotes?max_age=${maxAge}`;
		const response = await fetch(url);
		const data = await response.json();
		setQuotes(data.quotes || []);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const formData = new FormData();
		formData.append("name", name);
		formData.append("message", message);
		
		await fetch("/api/quote", {
			method: "POST",
			body: formData
		});
		
		setName("");
		setMessage("");
		fetchQuotes();
	};

	const formatTime = (timeString) => {
		const date = new Date(timeString);
		const now = new Date();
		const diffMs = now - date;
		const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
		
		if (diffDays === 0) {
			return "Today";
		} else if (diffDays === 1) {
			return "Yesterday";
		} else if (diffDays < 7) {
			return `${diffDays} days ago`;
		} else if (diffDays < 30) {
			const weeks = Math.floor(diffDays / 7);
			return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
		} else if (diffDays < 365) {
			const months = Math.floor(diffDays / 30);
			return `${months} month${months > 1 ? "s" : ""} ago`;
		} else {
			const years = Math.floor(diffDays / 365);
			return `${years} year${years > 1 ? "s" : ""} ago`;
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
					<div key={index}>
						<p>{quote.name}</p>
						<p>{quote.message}</p>
						<p>{formatTime(quote.time)}</p>
					</div>
				))}
			</div>
		</div>
	);
}

export default App;
