# Native Methods

Native methods in Qilletni are functions that are bound to a Java method. They are defined like a normal method signature, but with no body. For instance,

```qilletni
native fun getHostname()
```

This page will go over how to use these functions, how to implement them, etc.

## Setting Up a Native Project

If you haven't created a project with native bindings, see the the [Project Structure](project_structure/#project-with-native-bindings) page for setting it up. In the `native_classes` section of your `qilletni_info.yml` file, ensure a Java class' canonical name is present. This should already be present in the project's template.

The naming standard of files with native methods in them is `XyzFunctions`, such as `CatFunctions`. For example,

```yaml title="qilletni_info.yml"
# ...
native_classes:
  - dev.qilletni.lib.cats.CatFunctions
```

## Creating a Basic Function

The following is a basic example of a function, in the class mentioned above.

```qilletni title="cats.ql"
native fun getCatNames()

string[] names = getCatNames()
print(names)  // Prints "[Olive, Johnny, Oyster]"
```

```java title="CatFunctions.java"
public class CatFunctions {
    public List<String> getCatNames() {
        return List.of("Olive", "Johnny", "Oyster");
    }
}
```

Qilletni offers the ability to both automatically convert to/from certain types when methods are invoked, and also some manual conversions. The following Java method is what it would look like without automatic conversions.

```java title="CatFunctions.java"
public class CatFunctions {
    private final ListAdapter listAdapter;
    
    public CatFunctions(ListAdapter listAdapter/*(1)!*/) {
        this.listAdapter = listAdapter;
    }
    
    public ListType getCatNames() {
        var list = List.of("Olive", "Johnny", "Oyster");
        return listAdapter.createListFromJava(list);
    }
}
```

1. This type is automatically injected into the class when the method is invoked. See [Native Bind Factories](/native_binding/native_bind_factories/) for other classes that may be injected.

The following is a basic example of a function that takes in a parameter. For demonstration, they are mixed in both auto converted types and an unconverted type.

```qilletni
native fun findAvgAge(cat1, cat2)
```

```java
public int findAvgAge(int cat1, IntType cat2) {
    int cat2Age = cat2.getValue();
    return (cat1 + cat2Age) / 2;
}
```

It is recommended to use automatic type conversion, but is not necessary. For a list of all automatic type conversions, see [Automatic Type Conversion](#automatic-type-conversion).

## Qilletni Type Structure

Native types in Qilletni are all subtypes of [QilletniType](https://api.qilletni.dev/qilletni.api/dev/qilletni/api/lang/types/QilletniType.html). A method may both return or take in any QilletniType.

## Automatic Type Conversion

To assist with dealing with built-in Qilletni types, Qilletni will automatically convert certain types to their Java counterparts. They convert both in method parameters and in the return type. The following is a table with the built-in type converters. The reason why there are duplicates is when a parameter is passed in from Qilletni, it converts it from a QilletniType to a Java type. When a Java type is returned, it converts it to a QilletniType.

| From                                                         | To                                                           | Notes                                                        |
| ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| [BooleanType](https://api.qilletni.dev/Qilletni.qilletni.api.main/is/yarr/qilletni/api/lang/types/BooleanType.html) | boolean                                                      |                                                              |
| boolean                                                      | [BooleanType](https://api.qilletni.dev/Qilletni.qilletni.api.main/is/yarr/qilletni/api/lang/types/BooleanType.html) |                                                              |
| [IntType](https://api.qilletni.dev/Qilletni.qilletni.api.main/is/yarr/qilletni/api/lang/types/IntType.html) | long                                                         |                                                              |
| long                                                         | [IntType](https://api.qilletni.dev/Qilletni.qilletni.api.main/is/yarr/qilletni/api/lang/types/IntType.html) |                                                              |
| [IntType](https://api.qilletni.dev/Qilletni.qilletni.api.main/is/yarr/qilletni/api/lang/types/IntType.html) | int                                                          |                                                              |
| int                                                          | [IntType](https://api.qilletni.dev/Qilletni.qilletni.api.main/is/yarr/qilletni/api/lang/types/IntType.html) |                                                              |
| [DoubleType](https://api.qilletni.dev/Qilletni.qilletni.api.main/is/yarr/qilletni/api/lang/types/DoubleType.html) | double                                                       |                                                              |
| double                                                       | [DoubleType](https://api.qilletni.dev/Qilletni.qilletni.api.main/is/yarr/qilletni/api/lang/types/DoubleType.html) |                                                              |
| [StringType](https://api.qilletni.dev/Qilletni.qilletni.api.main/is/yarr/qilletni/api/lang/types/StringType.html) | String                                                       |                                                              |
| String                                                       | [StringType](https://api.qilletni.dev/Qilletni.qilletni.api.main/is/yarr/qilletni/api/lang/types/StringType.html) |                                                              |
| [ListType](https://api.qilletni.dev/Qilletni.qilletni.api.main/is/yarr/qilletni/api/lang/types/ListType.html) | List                                                         | Currently, items inside a list are not transformed to Java types |
| List                                                         | [ListType](https://api.qilletni.dev/Qilletni.qilletni.api.main/is/yarr/qilletni/api/lang/types/ListType.html) | A list must contain only the same type                       |
| Map (Entity)                                                 | HashMap                                                      | Converts the std lib's Map to a HashMap                      |
| Object                                                       | [JavaType](https://api.qilletni.dev/Qilletni.qilletni.api.main/is/yarr/qilletni/api/lang/types/JavaType.html) | If a native method returns an Object (any non-converted class), it will be given to Qilletni as a JavaType |

### Skipping Automatic Type Conversion

If a type is returned and you don't want it to automatically convert, such as returning a JavaType of HashMap without converting it to the Map entity, the [@SkipReturnTypeAdapter](https://api.qilletni.dev/qilletni.api/dev/qilletni/api/lib/annotations/SkipReturnTypeAdapter.html) annotation may be used on the method. The following is an example that is used in the Map entity itself, to initialize a Java type of HashMap.

```java title="MapFunctions.java"
@SkipReturnTypeAdapter
public static Object _emptyJavaMap() {
    return new HashMap<>();
}
```

## Dealing With Entities

Entities are a little more complicated to handle in native methods, as they are inherently more complex than the predefined types. Luckily, Qilletni has the full ability to manipulate them and make your own.

When an entity instance is passed into a native method, it is passed in as an [EntityType](https://api.qilletni.dev/qilletni.api/dev/qilletni/api/lang/types/EntityType.html). To access the fields or functions in the entity, [getEntityScope()](https://api.qilletni.dev/qilletni.api/dev/qilletni/api/lang/types/EntityType.html#getEntityScope()) can be used, as shown below.

```qilletni title="cats.ql"
entity Cat {
	string name
	int age
	
	Cat(name, age)
}

native fun sayHello(cat)

Cat cat = new Cat("Beer", 2)
sayHello(cat)  // Prints "Hello Beer, you are 2 years old!"
```

```java title="CatFunctions.java"
public class CatFunctions {
    public void sayHello(EntityType catEntity) {
        StringType stringType = catEntity.getEntityScope().<StringType>lookup("name").getValue();
        String name = stringType.getValue();
        
        IntType intType = catEntity.getEntityScope().<IntType>lookup("age").getValue();
        long age = intType.getValue();
        
        System.out.println("Hello %s, you are %d years old!".formatted(name, age));
    }
}
```

The first [lookup()](https://api.qilletni.dev/qilletni.api/dev/qilletni/api/lang/table/Scope.html#lookup(java.lang.String)) call returns the [Symbol](https://api.qilletni.dev/qilletni.api/dev/qilletni/api/lang/table/Symbol.html), which is an internal representation of a variable that may hold any Qilletni type.
From there, the value from each is gotten which is the actual type instance. Note that [IntType](https://api.qilletni.dev/qilletni.api/dev/qilletni/api/lang/types/IntType.html)s are internally represented as `long`s.

If a variable is changed, the Symbol does not need to be re-set, but it can be. An example of a variable being updated is:

```qilletni title="cats.ql"
native fun catBirthday(cat)

Cat cat = new Cat("Beer", 2)
catBirthday(cat)

print(cat)  // Prints "Cat(name = Beer, age = 3)"
```

```java title="CatFunctions.java"
public void catBirthday(EntityType catEntity) {
    IntType age = catEntity.getEntityScope().<IntType>lookup("age").getValue();
    age.setValue(age.getValue() + 1);
}
```

### Entity/Record Conversion

Entities may also be automatically converted to and from Java records, using the [TypeConverter](https://api.qilletni.dev/qilletni.api/dev/qilletni/api/lang/types/conversion/TypeConverter.html) class.
The instance of this class is acquired through automatic injection, see [Native Bind Factories](/native_binding/native_bind_factories/) for more information, and the other classes available to use. Below is an example of taking in an entity and automatically converting it to a record.

```qilletni title="cats.ql"
entity Cat {
	string name
	int age
	
	Cat(name, age)
}

native fun sayHello(cat)

Cat cat = new Cat("Beer", 2)
sayHello(cat)  // Prints "Hello Beer, you are 2 years old!"
```

```java title="CatFunctions.java"
public class CatFunctions {
    private final TypeConverter typeConverter;
    
    public CatFunctions(TypeConverter typeConverter) {
        this.typeConverter = typeConverter;
    }
    
    private record Cat(String name, int age) {}

    public void sayHello(EntityType catEntity) {
        Cat cat = typeConverter.convertFromEntityToRecord(catEntity, Cat.class);
        System.out.println("Hello %s, you are %d years old!".formatted(cat.name(), cat.age()));
    }
}
```

The above code uses the [convertFromEntityToRecord](https://api.qilletni.dev/qilletni.api/dev/qilletni/api/lang/types/conversion/TypeConverter.html#convertFromEntityToRecord(dev.qilletni.api.lang.types.EntityType,java.lang.Class)) method to take an EntityType, and map its properties to a Java record that has fields of the same name.

Similarly, the [convertFromRecordToEntity](https://api.qilletni.dev/qilletni.api/dev/qilletni/api/lang/types/conversion/TypeConverter.html#convertFromRecordToEntity(java.lang.String,java.lang.Object)) method does the opposite, taking a Record and mapping it to an EntityType, matching its values up with the constructor of the entity, as shown below. This assumes the Cat entity is still defined.

```qilletni title="cats.ql"
native fun createNewCat(name, age)

Cat cat = createNewCat("Martini", 3)
print(cat)  // Prints "Cat(name = Martini, age = 3)"
```

```java title="CatFunctions.java"
public EntityType createNewCat(String name, int age) {
    Cat cat = new Cat(name, age);
    return typeConverter.convertFromRecordToEntity("Cat", cat);
}
```



## Native Entity Functions

Qilletni also supports native entity member functions. This is defined in Qilletni the same as a normal native method, just in the entity.

```qilletni title="cats.ql"
entity Cat {
	string name
	int age
	
	Cat(name, age)
	
	native fun pet()
}
```

Implementing this function in Java uses the [@NativeOn](https://api.qilletni.dev/qilletni.api/dev/qilletni/api/lib/annotations/NativeOn.html) annotation on the method. This takes in the entity name this is on (`on` in a similar context to an extension method's syntax).
Any native method on an Entity must accept an [EntityType](https://api.qilletni.dev/qilletni.api/dev/qilletni/api/lang/types/EntityType.html) as its first parameter (note this is not reflected in the Qilletni signature). This is the instance of the entity that the method is being invoked on.

```java title="CatFunctions.java"
@NativeOn("Cat")
public void pet(EntityType catEntity) {
    StringType name = catEntity.getEntityScope().<StringType>lookup("name").getValue();
    System.out.println("Petting %s!".formatted(name.getValue()));
}
```

Often times a whole Java class is dedicated for native methods on an entity. The [@NativeOn](https://api.qilletni.dev/qilletni.api/dev/qilletni/api/lib/annotations/NativeOn.html) annotation may also be applied to a class definition, making all methods that line up with signatures native methods, as shown below.
As with the case of normal native methods, the first parameter is the entity instance.

```java title="CatFunctions.java"
@NativeOn("Cat")
public class CatFunctions {
    public void pet(EntityType catEntity) {
        StringType name = catEntity.getEntityScope().<StringType>lookup("name").getValue();
        System.out.println("Petting %s!".formatted(name.getValue()));
    }
}
```

### Native Static Entity Functions

Static methods on entities may also have native definitions. These are the same as a normal native method on an entity, but instead of accepting an [EntityType](https://api.qilletni.dev/qilletni.api/dev/qilletni/api/lang/types/EntityType.html), it accepts a [StaticEntityType](https://api.qilletni.dev/qilletni.api/dev/qilletni/api/lang/types/StaticEntityType.html).
This provides the method with context regarding the [entity definition](https://api.qilletni.dev/qilletni.api/dev/qilletni/api/lang/types/entity/EntityDefinition.html), and the static scope of the entity.

## Injectable Types

Qilletni providers a set of classes that may be put in the constructor, and are populated when a native method is invoked. It also has the ability to inject your own classes to be used both by other libraries or scoped to just your own. See the [Native Bind Factories](/native_binding/native_bind_factories) page for more information on this.

## Preload Methods

Sometimes, especially in the case of when many methods are being performed on the same entity, a common action must happen before any of the methods get invoked. Executing code other than member variable setting is not recommended, so for this, the [@BeforeAnyInvocation](https://api.qilletni.dev/Qilletni.qilletni.api.main/is/yarr/qilletni/api/lib/annotations/BeforeAnyInvocation.html) annotation may be used on a single method in the class, which will be invoked before the body of any native method is ran. This method takes one parameter, which is the EntityType the method is being invoked on. This may set up instance variables (as there is one instance of the class for every call) or do anything else necessary. The example below is from the standard library std-lib, ensuring the song is populated with service provider data before an invocation is made on it.

```java title="SongFunctions.java"
@NativeOn("song")
public class SongFunctions {
    private final MusicPopulator musicPopulator;

    public SongFunctions(MusicPopulator musicPopulator) {
        this.musicPopulator = musicPopulator;
    }

    @BeforeAnyInvocation
    public void setupSong(SongType songType) {
        musicPopulator.populateSong(songType);
    }

    public String getTitle(SongType songType) { // (1)!
        return songType.getTrack().getName();
    }
}
```

1. If the `@BeforeAnyInvocation` method wasn't ran and the song hadn't been loaded yet, [getTrack()](https://api.qilletni.dev/qilletni.api/dev/qilletni/api/lang/types/SongType.html#getTrack()) would be null.
