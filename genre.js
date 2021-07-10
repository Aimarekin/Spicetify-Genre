// <reference path="./globals.d.ts" />

(function Genre() {
  const { CosmosAsync, Player } = Spicetify;

  /**
   * Fetch genre from artist
   *
   * @param artistURI {string}
   * @return {Promise<Array>}
   */
  const fetchGenres = async (artistURI) => {
    const res = await CosmosAsync.get(
      `https://api.spotify.com/v1/artists/${artistURI}`
    );
    // noinspection JSUnresolvedVariable
    return res.genres;
  };

  /**
   *
   * @type {Node}
   */
  let genreContainer = null;

  let infoContainer = document.querySelector('div.main-trackInfo-container');

  /**
   * Remove genre injection in the UI
   */
  const cleanInjection = () => {
    if (genreContainer !== null) {
      try {
        infoContainer.removeChild(genreContainer);
      } catch (e) {}
    }
  };

  /**
   * Inject genres to UI
   */
  const inject = () => {
    Player.addEventListener('onprogress', async () => {
      if (Player.data.track.metadata.hasOwnProperty('artist_uri')) {
        const id = Player.data.track.metadata.artist_uri.split(':')[2];
        const genres = await fetchGenres(id);

        cleanInjection();

        genreContainer = document.createElement('div');
        // noinspection JSUndefinedPropertyAssignment
        genreContainer.className =
          'main-trackInfo-genres ellipsis-one-line main-type-finale';
        // noinspection JSUnresolvedVariable
        genreContainer.style.color = 'var(--spice-extratext)';

        const span = document.createElement('span');
        span.innerText = genres.join(', ');
        genreContainer.appendChild(span);

        infoContainer.appendChild(genreContainer);
      } else {
        cleanInjection();
      }
    });
  };

  if (!CosmosAsync) {
    setTimeout(Genre, 500);
  } else {
    inject();
  }
})();
