function QuoteItem({ quote }) {
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
		<div>
			<p>{quote.name}</p>
			<p>{quote.message}</p>
			<p>{formatTime(quote.time)}</p>
		</div>
	);
}

export default QuoteItem;

