import { useEffect, useState } from "react";
import { db } from "./firebase";
import {
	addDoc,
	collection,
	deleteDoc,
	doc,
	getDocs,
	serverTimestamp,
} from "firebase/firestore";
import "./App.css";

function App() {
	const [note, setNote] = useState("");
	const [notes, setNotes] = useState([]);

	const loadNotes = async () => {
		const snapshot = await getDocs(collection(db, "notes"));
		const items = snapshot.docs.map((item) => ({
			id: item.id,
			...item.data(),
		}));

		items.sort((a, b) => {
			const aTime = a.createdAt?.toMillis?.() ?? 0;
			const bTime = b.createdAt?.toMillis?.() ?? 0;
			return bTime - aTime;
		});

		setNotes(items);
	};

	const saveNote = async () => {
		if (!note.trim()) {
			alert("Please enter a note first.");
			return;
		}

		await addDoc(collection(db, "notes"), {
			text: note.trim(),
			createdAt: serverTimestamp(),
		});

		setNote("");
		await loadNotes();
	};

	const deleteNote = async (id) => {
		await deleteDoc(doc(db, "notes", id));
		await loadNotes();
	};

	useEffect(() => {
		loadNotes();
	}, []);

	return (
		<main className="app-page">
			<section className="card">
				<p className="eyebrow">Task Note</p>
				<h1>Frontend + Backend</h1>
				<p className="subtitle">Write a quick note and send it to Firebase.</p>

				<div className="input-row">
					<input
						type="text"
						placeholder="Enter note..."
						value={note}
						onChange={(e) => setNote(e.target.value)}
					/>
					<button onClick={saveNote}>Save</button>
				</div>

				<section className="history">
					<h2>History</h2>
					{notes.length === 0 ? (
						<p className="empty">No notes yet.</p>
					) : (
						<ul className="history-list">
							{notes.map((item) => (
								<li className="history-item" key={item.id}>
									<span className="history-text">{item.text}</span>
									<button
										type="button"
										className="delete-btn"
										onClick={() => deleteNote(item.id)}
									>
										Delete
									</button>
								</li>
							))}
						</ul>
					)}
				</section>
			</section>
		</main>
	);
}

export default App;