async function analyzeReel() {

  const url =
    document.getElementById('reelUrl').value;

  const resultDiv =
    document.getElementById('result');

  const loading =
    document.getElementById('loading');

  resultDiv.classList.add('hidden');

  loading.classList.remove('hidden');

  try {

    const response = await fetch(
      `/api/analyze?url=${encodeURIComponent(url)}`
    );

    const data =
      await response.json();

    loading.classList.add('hidden');

    resultDiv.classList.remove('hidden');

    if (data.error) {

      resultDiv.innerHTML = `
        <div class="result-card">
          <div class="result-content">
            <h2>Error</h2>
            <p>${data.error}</p>
          </div>
        </div>
      `;

      return;
    }

    resultDiv.innerHTML = `
      <div class="result-card">

        ${
          data.thumbnail
          ?
          `
            <img
              class="thumbnail"
              src="${data.thumbnail}"
            />
          `
          :
          ''
        }

        <div class="result-content">

          <h2>
            @${data.author}
          </h2>

          <div class="grid">

            <div class="info-box">
              <h3>Likes</h3>
              <p>${data.likes}</p>
            </div>

            <div class="info-box">
              <h3>Comments</h3>
              <p>${data.comments}</p>
            </div>

            <div class="info-box">
              <h3>Views</h3>
              <p>${data.views}</p>
            </div>

            <div class="info-box">
              <h3>Scraped</h3>
              <p>
                ${new Date(
                  data.timestamp
                ).toLocaleTimeString()}
              </p>
            </div>

          </div>

          <div class="caption">

            <h3>
              Caption
            </h3>

            <p>
              ${
                data.caption ||
                'No caption found.'
              }
            </p>

          </div>

          <div class="tags">

            ${
              data.hashtags
                .map(tag => `
                  <span class="tag">
                    ${tag}
                  </span>
                `)
                .join('')
            }

          </div>

          ${
            data.videoUrl
            ?
            `
              <a
                class="video-btn"
                href="${data.videoUrl}"
                target="_blank"
              >
                Open Video
              </a>
            `
            :
            ''
          }

        </div>

      </div>
    `;

  } catch (err) {

    loading.classList.add('hidden');

    resultDiv.classList.remove('hidden');

    resultDiv.innerHTML = `
      <div class="result-card">
        <div class="result-content">
          <h2>Server Error</h2>
          <p>${err.message}</p>
        </div>
      </div>
    `;
  }
}