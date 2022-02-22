// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 1.0.28
// 

using Colyseus.Schema;

public partial class Player : Schema {
	[Type(0, "string")]
	public string userId = default(string);

	[Type(1, "number")]
	public float health = default(float);

	[Type(2, "number")]
	public float lane = default(float);

	[Type(3, "number")]
	public float sheep = default(float);

	[Type(4, "array", typeof(ArraySchema<QueueObject>))]
	public ArraySchema<QueueObject> laneQueue1 = new ArraySchema<QueueObject>();

	[Type(5, "array", typeof(ArraySchema<QueueObject>))]
	public ArraySchema<QueueObject> laneQueue2 = new ArraySchema<QueueObject>();

	[Type(6, "array", typeof(ArraySchema<QueueObject>))]
	public ArraySchema<QueueObject> laneQueue3 = new ArraySchema<QueueObject>();

	[Type(7, "array", typeof(ArraySchema<QueueObject>))]
	public ArraySchema<QueueObject> laneQueue4 = new ArraySchema<QueueObject>();

	[Type(8, "array", typeof(ArraySchema<QueueObject>))]
	public ArraySchema<QueueObject> laneQueue5 = new ArraySchema<QueueObject>();

	[Type(9, "array", typeof(ArraySchema<QueueObject>))]
	public ArraySchema<QueueObject> collisionQueue1 = new ArraySchema<QueueObject>();

	[Type(10, "array", typeof(ArraySchema<QueueObject>))]
	public ArraySchema<QueueObject> collisionQueue2 = new ArraySchema<QueueObject>();

	[Type(11, "array", typeof(ArraySchema<QueueObject>))]
	public ArraySchema<QueueObject> collisionQueue3 = new ArraySchema<QueueObject>();

	[Type(12, "array", typeof(ArraySchema<QueueObject>))]
	public ArraySchema<QueueObject> collisionQueue4 = new ArraySchema<QueueObject>();

	[Type(13, "array", typeof(ArraySchema<QueueObject>))]
	public ArraySchema<QueueObject> collisionQueue5 = new ArraySchema<QueueObject>();
}

