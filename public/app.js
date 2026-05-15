async function analyzeReel() {

  const url =
    document.getElementById("reelUrl").value;

  const result =
    document.getElementById("result");

  result.innerHTML =
    `<div class="loading">Analyzing reel...</div>`;

  try {

    const response =
      await fetch(
        `/api/analyze?url=${encodeURIComponent(url)}`
      );

    const data =
      await response.json();

    if (!response.ok) {

      throw new Error(
        data.error || "Failed to analyze reel"
      );
    }

    const hashtags =
      data.hashtags || [];

    result.innerHTML = `

      <div class="card">

        <h2>Analysis Result</h2>

        <div class="grid">

          <div class="item">
            <span class="label">Author</span>
            <span class="value">
              ${data.author || "Unknown"}
            </span>
          </div>

          <div class="item">
            <span class="label">Likes</span>
            <span class="value">
              ${data.likes || "Hidden"}
            </span>
          </div>

          <div class="item">
            <span class="label">Comments</span>
            <span class="value">
              ${data.comments || "Hidden"}
            </span>
          </div>

          <div class="item">
            <span class="label">Views</span>
            <span class="value">
              ${data.views || "Hidden"}
            </span>
          </div>

        </div>

        <div class="hashtags">

          <h3>Hashtags</h3>

          <div class="tags">

            ${
              hashtags.length
                ? hashtags.map(tag =>
                    `<span class="tag">${tag}</span>`
                  ).join("")
                : "<span>No hashtags found</span>"
            }

          </div>

        </div>

      </div>
    `;

  } catch (err) {

    result.innerHTML = `

      <div class="error">

        <h3>Server Error</h3>

        <p>${err.message}</p>

      </div>
    `;
  }
}