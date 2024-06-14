import https from 'https';

const hcCrateOptions = {
  hostname: 'crates.io',
  port: 443,
  path: '/api/v1/crates/holochain_cli',
  method: 'GET',
  headers: {
    'User-Agent': 'Holochain Binaries'
  }
};

const binariesTagsOptions = {
  hostname: 'api.github.com',
  port: 443,
  path: '/repos/matthme/holochain-binaries/git/refs/tags',
  method: 'GET',
  headers: {
    'User-Agent': 'Holochain Binaries'
  }
}

getAndDo(hcCrateOptions, (data) => {
  const hcCrateDetails = JSON.parse(data);
  // const latestHcVersion = hcCrateDetails.crate.newest_version;
  // check for last 3 versions
  const latestHcVersions = hcCrateDetails.versions.sort((va, vb) => vb.created_at.localeCompare(va.created_at)).slice(0,3).map(v => v.num);
  getAndDo(binariesTagsOptions, (data) => {
    const binaryTags = JSON.parse(data);
    // Check whether the latest holochain_client crate version already has a tag in the holochain-binaries repo. If not, log it to the console
    const binaryTagHcVersions = binaryTags.filter((tag) => tag.ref.includes('hc-binaries')).map((tag) => tag.ref.replace('refs/tags/hc-binaries-', ''));
    for (const version of latestHcVersions) {
      if (!binaryTagHcVersions.includes(version)) {
        console.log(version);
        return;
      }
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