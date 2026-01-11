# Entities

An entity in Qilletni is a reusable template/blueprint that contains a set number of fields and methods in its own scope, that may be instantiated to encapsulate data. In Java, this would be considered a class.

An entity is relatively basic, the following is an example of some of the features supported.

```qilletni
entity User {
	int _id // (1)!
	string username
	boolean alive = true // (2)!
	
	User(_id, username) // (3)!
	
	/* (4)! */static fun createPerson(username) {
		int id = random(0, 100)
		return new User(id, username)
	}
	
	fun getId() {
		return _id
	}
}

User user = User.createPerson("bob")
print(user)  // Prints: "User(alive = true, _id = 0, username = bob)"
```

1.  A private field, that can not be accessed outside the entity
2.  A predefined field, that can not be in the constructor
3.  A constructor is required with all the fields without values
4.  `static` methods may be invoked without an instance of the entity, such as `User.createPerson`

Below is an in-depth overview of all supported features of an entity.

## Fields

An entity has a constant set of fields, meaning more fields may not be added during runtime. As with any variable in Qilletni, a field may not have no value, so fields must be either have a value given or be specified in the [constructor](#constructors).

Accessing a field in an entity is done with the accessor notation, `.`

```qilletni
User user = new User(1, "Alice")

print(user.username)
user.username = "Jane"
```

Fields that begin with an underscore may not be accessed from outside of the entity.

```qilletni
int i = user._id  // Invalid
```

It is standard to use public fields and not getters unless needed.

## Constructors

A constructor is very simple, and only sets uninitialized fields in the entity. It does not support code execution upon initialization, for that it is recommended to use a static method initializer. The order of fields in a constructor don't matter, and may use private fields.

## Functions

Functions may be defined in an entity like a normal method. Similarly to fields, functions that begin with an underscore may not be accessed outside of the entity.

### Static Functions

Static functions do not need to be accessed with an instance of the entity, so they don't have access to any fields the entity has. They are used usually for initialization of an entity that may need special restrictions or code invoked during initialization.

```qilletni
entity Car {
	int speed

	Car(speed)

	static fun create() {
		return new Car(0)
	}
	
	fun getSpeed() {
		return speed
	}
}

Car.create()    // Returns new Car
Car.getSpeed()  // Error, must be invoked on an instance of Car
```

## String Visualization

Similar to other languages, Qilletni supports a `toString()` function to visualize the string representation of an entity.

If the function `toString()` is defined, it will be called when getting the string representation of an entity, such as printing it out. This may also be called directly.

For example, if the following function was inserted in the entity `User` from the first section of this page:

```qilletni
fun toString() {
    return "User(id=%d, username='%s')".format([_id, username])
}
```

Then printing out a user would look like:

```
User(id=1, username='bob')
```
