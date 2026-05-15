async function analyzeReel() {

  const url =
    document.getElementById("reelUrl").value;

  const result =
    document.getElementById("result");

  result.innerHTML =
    "<p>Scraping reel...</p>";

  try {

    const response =
      await fetch(
        `/api/analyze?url=${encodeURIComponent(url)}`
      );

    const data =
      await response.json();

    console.log(data);

    if (!data.success) {

      throw new Error(
        data.error || "Unknown server error"
      );
    }

    const hashtags =
      data.hashtags || [];

    result.innerHTML = `

      <div class="card">

        <h2>Instagram Reel Analysis</h2>

        <p><strong>Author:</strong> ${data.author}</p>

        <p><strong>Likes:</strong> ${data.likes}</p>

        <p><strong>Comments:</strong> ${data.comments}</p>

        <p><strong>Views:</strong> ${data.views}</p>

        <h3>Hashtags</h3>

        <div class="hashtags">

          ${
            hashtags.length
              ? hashtags.map(tag =>
                  `<span class="tag">${tag}</span>`
                ).join("")
              : "No hashtags found"
          }

        </div>

      </div>
    `;

  } catch (err) {

    console.error(err);

    result.innerHTML = `

      <div class="error">

        <h3>Server Error</h3>

        <p>${err.message}</p>

      </div>
    `;
  }
}