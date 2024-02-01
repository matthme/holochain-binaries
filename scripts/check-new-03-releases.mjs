import https from 'https';

const holochainReleasesOptions = {
  hostname: 'api.github.com',
  port: 443,
  path: '/repos/holochain/holochain/releases',
  method: 'GET',
  headers: {
    'User-Agent': 'Holochain Binaries'
  }
};

const binariesTagsOptions = {
  hostname: 'api.github.com',
  port: 443,
  path: '/repos/matthme/holochain-binaries/tags',
  method: 'GET',
  headers: {
    'User-Agent': 'Holochain Binaries'
  }
}

getAndDo(holochainReleasesOptions, (data) => {
  const allReleases = JSON.parse(data);
  // filter by releases that have been published in the last 10 hours
  const recentReleases = allReleases.filter((release) => Date.now() - (new Date(release.published_at)).getTime() < 36000000);
  getAndDo(binariesTagsOptions, (data) => {
    const binaryTags = JSON.parse(data);
    // Check for holochain 0.2 releases that have not yet a tag in the holochain-binaries repo
    const binaryTagHcVersions = binaryTags.map((tag) => tag.name.replace('-binaries', ''));
    const unbuiltReleases = recentReleases.map((release) => release.tag_name).filter((releaseName) => !binaryTagHcVersions.includes(releaseName));
    const unbuilt03Releases = unbuiltReleases.filter((tagName) => tagName.startsWith('holochain-0.3'));
    // We assume that there is only one new release without tag
    if (unbuilt03Releases.length > 0) {
      console.log(unbuilt03Releases[0]);
    }

  })
})


function getAndDo(options, callback) {
  https.get(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      callback(data);
    });

  }).on('error', (err) => {
    console.log("Error: ", err.message);
  })
}