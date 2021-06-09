const AreEqual = (s1, s2) => {
	// treat underscores and spaces as equal, also equal to empty string since we ignore punctuation.
	const s1_ = s1.replace(" ", "_");
	const s2_ = s2.replace(" ", "_");
	return (
		0 ===
		s1_.localeCompare(s2_, undefined, {
			ignorePunctuation: true,
			sensitivity: "base",
			usage: "search",
			ignorePunctuation: "true",
		})
	);
};

const _StringsAreEqual = AreEqual;
export { _StringsAreEqual as StringsAreEqual };
