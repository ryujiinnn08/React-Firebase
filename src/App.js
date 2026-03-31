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
	const [name, setName] = useState("");
	const [course, setCourse] = useState("");
	const [yearLevel, setYearLevel] = useState("");
	const [records, setRecords] = useState([]);

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

		setRecords(items);
	};

	const saveNote = async () => {
		if (!name.trim() || !course.trim() || !yearLevel) {
			alert("Please complete Name, Course, and Year Level.");
			return;
		}

		await addDoc(collection(db, "notes"), {
			name: name.trim(),
			course: course.trim(),
			yearLevel,
			createdAt: serverTimestamp(),
		});

		setName("");
		setCourse("");
		setYearLevel("");
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
				<p className="eyebrow">Student Form</p>
				<h1>Frontend + Backend</h1>
				<p className="subtitle">Submit Name, Course, and Year Level to Firebase.</p>

				<div className="form-grid">
					<input
						type="text"
						placeholder="Name"
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>
					<input
						type="text"
						placeholder="Course"
						value={course}
						onChange={(e) => setCourse(e.target.value)}
					/>
					<select value={yearLevel} onChange={(e) => setYearLevel(e.target.value)}>
						<option value="">Select Year Level</option>
						<option value="1">1</option>
						<option value="2">2</option>
						<option value="3">3</option>
						<option value="4">4</option>
						<option value="5">5</option>
					</select>
					<button onClick={saveNote}>Save</button>
				</div>

				<section className="history">
					<h2>Saved Entries</h2>
					{records.length === 0 ? (
						<p className="empty">No entries yet.</p>
					) : (
						<ul className="history-list">
							{records.map((item) => (
								<li className="history-item" key={item.id}>
									<div className="history-text">
										<strong>{item.name ?? "Unknown"}</strong>
										<span>{item.course ?? item.text ?? "No course"}</span>
										<span>Year {item.yearLevel ?? "N/A"}</span>
									</div>
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