import sqlite3

# Connect to the existing database
conn = sqlite3.connect('seats.db')
cursor = conn.cursor()

# Insert some seats
seats = [
    ('A1',),
    ('A2',),
    ('A3',),
    ('B1',),
    ('B2',),
]

for seat in seats:
    try:
        cursor.execute("INSERT INTO seats (seat_number) VALUES (?)", seat)
    except sqlite3.IntegrityError:
        print(f"Seat {seat[0]} already exists. Skipping.")

# Reserve a couple of seats
cursor.execute("SELECT id FROM seats WHERE seat_number = 'A1'")
seat_id_a1 = cursor.fetchone()
if seat_id_a1:
    cursor.execute("UPDATE seats SET status = 'reserved' WHERE id = ?", (seat_id_a1[0],))
    cursor.execute("INSERT INTO reservations (seat_id, user_name) VALUES (?, ?)", (seat_id_a1[0], "Alice"))

cursor.execute("SELECT id FROM seats WHERE seat_number = 'A2'")
seat_id_a2 = cursor.fetchone()
if seat_id_a2:
    cursor.execute("UPDATE seats SET status = 'reserved' WHERE id = ?", (seat_id_a2[0],))
    cursor.execute("INSERT INTO reservations (seat_id, user_name) VALUES (?, ?)", (seat_id_a2[0], "Bob"))

# Commit and close
conn.commit()
conn.close()

print("Dummy data inserted.")
