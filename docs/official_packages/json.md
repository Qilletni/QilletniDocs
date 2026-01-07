---
package_name: qilletni/json
package_version: 1.0.0
package_author: Adam Yarris
package_github: https://github.com/Qilletni/QilletniJson
package_docs: https://docs.qilletni.dev/library/json
---

# Json

The JSON package is a simple JSON serializer and deserializer for Qilletni types. All types are supported, including lists, arbitrary entities, nested objects, and [Map](https://docs.qilletni.dev/library/std/entity/Map)s.

The primary functions in the package are [`createJsonConverter()`](https://docs.qilletni.dev/library/json/entity/JsonConverter#native+static+fun+createJsonConverter%28prettyPrint%29), [`toJson(obj)`](https://docs.qilletni.dev/library/json/entity/JsonConverter#native+fun+toJson%28obj%29) and [`fromJson(str)`](https://docs.qilletni.dev/library/json/entity/JsonConverter#native+fun+fromJson%28str%29).
Examples are found in the package's [examples directory](https://github.com/Qilletni/QilletniJson/tree/master/examples), but some are outlined below.

## Basic Serialization/Deserialization

This shows basic deserialization, modification, and serialization ofa simple JSON object.

```qilletni
import "json:json.ql"

string jsonStr = "{\"a\": \"Hello\", \"c\": 5}"

JsonConverter json = JsonConverter.createJsonConverter(true)

Map map = json.fromJson(jsonStr)
print("a = " + map.get("a"))
print("c = " + map.get("c"))

int c = map.get("c")

print("cint = " + c)

map.put("b", "World")
map.put("c", map.get("c") + 5)

print(json.toJson(map))
```

Output:

```txt
a = Hello
c = 5
cint = 5
{"a":"Hello","b":"World","c":10}
```

## Serialization With List

A demonstration of native Qilletni-provided map/list construction. The below example would be used when serializing a known structure of data, rather than using a string.

```qilletni
import "json:json.ql"

Map map = Map.fromList(any["one", "two", "three", any[1, 2, 3, 4]])

JsonConverter json = JsonConverter.createJsonConverter(true)

print(json.toJson(map))
```

Output:

```txt
{"one":"two","three":[1,2,3,4]}
```

## Nested/Mixed Type Introspection

This example deserializes a JSON string into a Map, and checks the type of each value in the inner list. This shows proper type assumptions.

```qilletni
import "json:json.ql"

string jsonStr = "{\"a\": [1, 2, 3.3, 4, [\"a\", \"b\", \"c\"], 5]}"

print("jsonStr = " + jsonStr)

JsonConverter json = JsonConverter.createJsonConverter(true)

Map map = json.fromJson(jsonStr)
print("a = " + map.get("a"))

for (var : map.get("a")) {
    if (var is int) {
        print("var is int: " + var)    
    } else if (var is double) {
        print("var is double: " + var)
    } else if (var is []) {
        print("var is list: " + var)
    }
}

any[] someList = [1, 2, 3, ["a", "b", "c"], 5] // (1)!
Map jsonMap = new Map()
jsonMap.put("a", someList)

print(json.toJson(jsonMap))
```

1. A similar JSON object to serialize, with `3` instead of `3.3`.

Output:

```txt
jsonStr = {"a": [1, 2, 3.3, 4, ["a", "b", "c"], 5]}
a = [1, 2, 3.3, 4, [a, b, c], 5]
var is int: 1
var is int: 2
var is double: 3.3
var is int: 4
var is list: [a, b, c]
var is int: 5
{"a":[1,2,3,["a","b","c"],5]}
```
