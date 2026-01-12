from pymongo import MongoClient, ReturnDocument

client = MongoClient("mongodb://localhost:27017")
db = client.ai_tool_platform

users_collection = db.users
tools_collection = db.tools
reviews_collection = db.reviews

# counters collection used for numeric auto-increment IDs
counters_collection = db.counters


def get_next_sequence(name: str) -> int:
	"""Atomically get next sequence number for a named counter.

	Usage: call get_next_sequence("tools") or get_next_sequence("reviews").
	This will create the counter document if it doesn't exist and return the
	incremented integer value.
	"""
	doc = counters_collection.find_one_and_update(
		{"_id": name},
		{"$inc": {"seq": 1}},
		upsert=True,
		return_document=ReturnDocument.AFTER,
	)
	return int(doc.get("seq", 0))
