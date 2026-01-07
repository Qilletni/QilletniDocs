---
package_name: qilletni/lastfm
package_version: 1.0.0-SNAPSHOT
package_author: Adam Yarris
package_github: https://github.com/Qilletni/QilletniLastFm
package_docs: https://docs.qilletni.dev/library/lastfm
---

# Last.fm

The Last.fm package is a limited service provider that does **not** implement the [native feature set](/language/service_providers/#the-native-feature-set). Due to the nature of Last.fm, some concepts don't cleanly carry over to Qilletni, such as user playlists.

The following features are implemented as part of the native feature set:

- Song lookup
- Artist lookup
- Music type conversion

All other features that are Last.fm specific are provided by functions in the library, documented in [`lastfm.ql`](https://docs.qilletni.dev/library/lastfm/file/lastfm.ql).

All root-level methods in the library return a [`LastFmResult`](https://docs.qilletni.dev/library/lastfm/entity/LastFmResult), which is an entity that wraps the result of a Last.fm API call.
To ensure that this library returns standard Qilletni music types that can be easily used and converted (such as `song[]` or `Artist[]`), the library places these direct types in the `data` field of the result.

For responses that include metadata with the music type list, additional information is stored in the `wrappedData` field.
For example, the [`getTopTracks(user)`](https://docs.qilletni.dev/library/lastfm/file/lastfm.ql#native+fun+getTopTracks%28user%29) function returns `song[]` as its `data` field, but `wrappedData` is a [`TopTrack[]`](https://docs.qilletni.dev/library/lastfm/entity/TopTrack), which contains fields for `track` (the `song` also in the `data` list), `playCount` and `rank`.

The following is an example of using the library, and using the result to another service provider:

```qilletni
import "lastfm:lastfm.ql"
import "spotify:playlist_tools.ql"

provider "lastfm"

Page page = new Page()
                ..page = 1
                ..count = 100

LastFmResult result = getTopTracks("RubbaBoy", "3month", page)

if (result.isError()) {
    printf("Error: %s", [result.errorMessage])
    exit(1)
}

for (track : result.wrappedData.getValue()) { // (1)!
    printf("%s\t plays  %s", [track.playCount, track.track])
}

provider "spotify"

collection newPlaylist = createPlaylist("Top Song Playlist")
addToPlaylist(newPlaylist, result.data) // (2)!

print("Created a playlist with %s songs".format([result.data.size()]))
```

1. Prints out an ordered list of the top played tracks
2. `result.data` is a `song[]`, so it's automatically converted to use with a new Spotify playlist
