---
package_name: qilletni/tidal
package_version: 1.0.0-SNAPSHOT
package_author: Adam Yarris
package_github: https://github.com/Qilletni/QilletniTidal
package_docs: https://docs.qilletni.dev/library/tidal
---

# Tidal

The Tidal package is a service provider implementing the full [native feature set](/language/service_providers/#the-native-feature-set) with additional capabilities such as playlist management planned soon. Due to API limitations, the `play` is unable to add to the user's queue.

## Features

### Smart Fuzzy Searching

Tidal supports native fuzzy searching, which is provided by a [search strategy](# "Docs on this feature coming soon").
Typically in a service provider, a song is looked up by its title and artist, and the best match is returned from the API (which may have some fuzzyness) if it wasn't in the song database.

With Tidal, it was observed that the search API was less accurate in some instances than expected, so a custom search strategy was implemented.
This will search a song's title and artist, and run an algorithm to identify which of the results is the best match (exact matches are preferred).
Once found, the searched title and artist are stored with the song as an alias, so future queries for this can go directly to the database.

Search strategies are provided by Qilletni, with implementations dependent on the service provider. This logic will likely come to other service providers soon.

The following is an example of using the search strategy. See the tooltips for descriptions of both lookups.

```qilletni
import "tidal:tidal.ql"
import "std:provider.ql"

provider "tidal"

setFetchResolveStrategy("fuzzy")

song jealous = "Jealous" by "Chromeo" // (1)!

song cachedJealous = "Jealous" by "Chromeo" // (2)!
```

1. Makes an API call, and resolves to `"Jealous (I Ain't With It)" by "Chromeo"`, which is a fuzzy match to
   `"Jealous" by "Chromeo"` which is now in the database, and does not need fuzzy searching for future lookups
2. Makes a database lookup, no API call needed

To set the search strategy to the default one, use `setFetchResolveStrategy("default")`. From here, database lookups are only used for exact matches.
