/**
 * Render a playlist dynamically in the given container with a shared legend.
 * @param {string} containerId - The ID of the container element.
 * @param {Object} songColors - A map of song names to their colors.
 * @param {Array} displayOrder - An array specifying the order of songs to display.
 * @param {string} title - The title for the playlist.
 * @param {list} songsToTitle - A list of songs to display the title for in the song line.
 */
function renderPlaylist(containerId, songColors, displayOrder, title, songsToTitle = []) {
    const playlistElement = document.getElementById(containerId);

    if (!playlistElement) {
        console.error(`Container with ID "${containerId}" not found.`);
        return;
    }

    // Clear any existing content
    playlistElement.innerHTML = "";

    // Add the title
    const playlistTitle = document.createElement("div");
    playlistTitle.className = "playlist-title";
    playlistTitle.textContent = title;
    playlistElement.appendChild(playlistTitle);

    // Create the playlist rows
    const playlistRows = document.createElement("div");
    playlistRows.className = "playlist-rows";

    displayOrder.forEach(song => {
        const color = songColors[song] || "#000"; // Default to black if color not found
        const songElement = document.createElement("div");
        songElement.className = "song";
        songElement.style.backgroundColor = color;
        
        if (songsToTitle.includes(song)) {
            const songTitle = document.createElement("span");
            songTitle.className = "song-title";
            songTitle.textContent = song;
            songElement.appendChild(songTitle);
        }

        playlistRows.appendChild(songElement);
    });

    // Append the rows to the playlist
    playlistElement.appendChild(playlistRows);
}

/**
 * Render a shared legend dynamically in the given container.
 * @param {string} containerId - The ID of the container element.
 * @param {Object} songColors - A map of song names to their colors.
 */
function renderLegend(containerId, songColors) {
    const legendElement = document.getElementById(containerId);

    if (!legendElement) {
        console.error(`Container with ID "${containerId}" not found.`);
        return;
    }

    // Clear any existing content
    legendElement.innerHTML = "";

    // Create legend items
    Object.keys(songColors).forEach(song => {
        const legendItem = document.createElement("div");
        legendItem.className = "legend-item";

        const colorSquare = document.createElement("span");
        colorSquare.className = "color-square";
        colorSquare.style.backgroundColor = songColors[song];

        const songName = document.createElement("span");
        songName.className = "song-name";
        songName.textContent = song;

        legendItem.appendChild(colorSquare);
        legendItem.appendChild(songName);
        legendElement.appendChild(legendItem);
    });
}

