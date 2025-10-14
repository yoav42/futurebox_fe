import React from "react";

interface CountdownTimerProps {
	releaseAt: string;
	unlocked: boolean;
	secondsUntilUnlock: number;
	daysUntilUnlock: number;
}

export default function CountdownTimer({ releaseAt, unlocked, secondsUntilUnlock, daysUntilUnlock }: CountdownTimerProps) {
	const [timeLeft, setTimeLeft] = React.useState(secondsUntilUnlock);

	React.useEffect(() => {
		if (unlocked || timeLeft <= 0) return;

		const timer = setInterval(() => {
			setTimeLeft((prev) => Math.max(0, prev - 1));
		}, 1000);

		return () => clearInterval(timer);
	}, [unlocked, timeLeft]);

	if (unlocked) {
		return (
			<div className="text-xs text-emerald-600 font-medium">
				✓ Unlocked
			</div>
		);
	}

	// Calculate time components
	const days = Math.floor(timeLeft / 86400);
	const hours = Math.floor((timeLeft % 86400) / 3600);
	const minutes = Math.floor((timeLeft % 3600) / 60);
	const seconds = timeLeft % 60;

	// Format display based on time remaining
	const formatCountdown = () => {
		if (days > 365) {
			const years = Math.floor(days / 365);
			return `${years} year${years > 1 ? 's' : ''}`;
		}
		if (days > 30) {
			const months = Math.floor(days / 30);
			return `${months} month${months > 1 ? 's' : ''}`;
		}
		if (days > 0) {
			return `${days}d ${hours}h`;
		}
		if (hours > 0) {
			return `${hours}h ${minutes}m`;
		}
		if (minutes > 0) {
			return `${minutes}m ${seconds}s`;
		}
		return `${seconds}s`;
	};

	// Color coding based on urgency
	const getColorClass = () => {
		if (days > 30) return "text-slate-600 bg-slate-100";
		if (days > 7) return "text-blue-700 bg-blue-100";
		if (days > 1) return "text-amber-700 bg-amber-100";
		return "text-rose-700 bg-rose-100";
	};

	return (
		<div className="flex flex-col gap-1">
			<div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${getColorClass()}`}>
				<svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
				</svg>
				<span>{formatCountdown()}</span>
			</div>
			<div className="text-xs text-slate-500">
				{new Date(releaseAt).toLocaleDateString()}
			</div>
		</div>
	);
}


