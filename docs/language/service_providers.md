# Service Providers

Music is handled through a service provider, which is a Qilletni package with additional features. This is often an implementation of an API, such as Spotify, that handles necessary caching and lookups, abstracted by Qilletni's API. This allows for drop-in replacements of what music service is being used. The following is an example of getting a song from the Last.Fm provider. The Last.Fm provider also provides access to API methods to get specific data on the user.

```qilletni
import "lastfm:lastfm.ql"

provider "lastfm" // (1)!

print("\tProvider is Last.FM")

Page page = new Page()
                ..page = 1
                ..count = 1

song topSong = getTopTracks("RubbaBoy", "7day", page).data[0] // (2)!

print(topSong)

provider "spotify" { // (3)!
    print("\tProvider is Spotify")
    
    print(topSong.getId()) // (4)!
}
```

1. A `provider` statement without brackets switches the whole program to use the provider, in this case, Last.Fm
2. Gets a Last.Fm song
3. Everything in this block is now in the Spotify provider, so anything accessed will automatically convert to this service provider
4. Prints the Spotify ID of the song

This results in the following output, which prints out the user's top song from Last.Fm, and then its Spotify ID:

```
        Provider is Last.FM
song("Late Night Drinking" by "nowifi")
        Provider is Spotify
4Xl2xUFmj2xbszjYjEXxkx
```

Conversions between service providers are only done if needed, and data is cached for quick switching.

## Syntax

Service provider switching may be done two ways, full-program switching or through a block. Full-program switching is done via:

```
provider "library name"
```

If you are developing a library, be careful with this syntax because the running application may be left off with a different provider than originally intended. The other syntax is safer, and only sets the provider for the given code block:

```qilletni
provider "library name" {
	// Code here
}
```

The name of the provider is the library's name.

## The Native Feature Set

Service providers have varying levels of implementation, depending on both maturity and APIs available from the service.

Qilletni specifies a specific "native" feature set that is expected for service providers to support. This feature set is generic enough where most service providers should be able to support them, including:

- Song lookup
- Artist lookup
- User lookup
- Collection lookup
- `play` functionality
- Music type conversion between service providers

On top of these, service providers may have additional features through the normal package interface. This may include things like playlist modification, recommendations, etc.
