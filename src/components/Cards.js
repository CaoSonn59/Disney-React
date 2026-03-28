import React from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";

function Cards() {
	const recommendedRef = firebase.firestore().collection("recommended");
	const [movies, loading, error] = useCollectionData(recommendedRef, { idField: "id" });

	if (loading) return <div style={{ padding: 16 }}>Loading...</div>;
	if (error) return <div style={{ padding: 16, color: "red" }}>Error: {error.message}</div>;

	return (
		<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 16, padding: 16 }}>
			{(movies || []).map((m) => (
				<div key={m.id} style={{ background: "#111", color: "#fff", borderRadius: 8, overflow: "hidden" }}>
					<img src={m.image} alt={m.title} style={{ width: "100%", aspectRatio: "2/3", objectFit: "cover" }} />
					<div style={{ padding: 8 }}>
						<div style={{ fontWeight: 600 }}>{m.title}</div>
						<div style={{ fontSize: 12, opacity: 0.8 }}>{m.year} • {m.rating}</div>
					</div>
				</div>
			))}
		</div>
	);
}

export default Cards; 