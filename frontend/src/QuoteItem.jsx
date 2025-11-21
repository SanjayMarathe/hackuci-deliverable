import { useState } from "react";
import "./QuoteItem.css";

function QuoteItem({ quote }) {
	const [isExpanded, setIsExpanded] = useState(false);
	const MAX_LENGTH = 150;
	const isLong = quote.message.length > MAX_LENGTH;
	const displayMessage = isLong && !isExpanded 
		? quote.message.substring(0, MAX_LENGTH) + "..."
		: quote.message;

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
		<div className="quote-item">
			<div className="quote-header">
				<h3 className="quote-name">{quote.name}</h3>
				<span className="quote-time">{formatTime(quote.time)}</span>
			</div>
			<p className="quote-message">{displayMessage}</p>
			{isLong && (
				<button 
					className="expand-button"
					onClick={() => setIsExpanded(!isExpanded)}
				>
					{isExpanded ? "Show Less" : "Show More"}
				</button>
			)}
		</div>
	);
}

export default QuoteItem;

