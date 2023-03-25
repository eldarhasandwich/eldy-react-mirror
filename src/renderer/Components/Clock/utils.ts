
const padTwoZeros = (n: number) => String(n).padStart(2, "0");

export const get12HrTime = (time: Date) => {
	const [h, m] = [time.getHours(), time.getMinutes()];
	const hourModulo = h % 12;

	return `${hourModulo === 0 ? 12 : hourModulo}:${padTwoZeros(m)}${h >= 12 ? "pm" : "am"}`;
};

export const get24HrTime = (time: Date) => {
    const [h, m, s] = [time.getHours(), time.getMinutes(), time.getSeconds()].map(padTwoZeros);
    return `${h}:${m}:${s}`;
}

export const getDeltaTime = (targetTime: Date, currentTime: Date) => {
	let timeUntil = Math.ceil(targetTime.getTime() / 1000) - Math.ceil(currentTime.getTime() / 1000);

	let hasPassed = false;
	if (timeUntil < 0) {
		timeUntil *= -1;
		hasPassed = true;
	}

	const nMinutes = Math.floor(timeUntil / 60);
	const nHours = Math.floor(nMinutes / 60);

	return `${nHours !== 0 ? nHours + " hours " : ""}${nMinutes - nHours * 60} minutes ${hasPassed ? "ago" : ""}`;
};