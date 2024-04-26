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
  path: '/repos/matthme/holochain-binaries/tags',
  method: 'GET',
  headers: {
    'User-Agent': 'Holochain Binaries'
  }
}

getAndDo(hcCrateOptions, (data) => {
  const hcCrateDetails = JSON.parse(data);
  const latestHcVersion = hcCrateDetails.crate.newest_version;
  getAndDo(binariesTagsOptions, (data) => {
    const binaryTags = JSON.parse(data);
    // Check whether the latest lair_keystore crate version already has a tag in the holochain-binaries repo. If not, log it to the console
    const binaryTagHcVersions = binaryTags.filter((tag) => tag.name.includes('hc-binaries')).map((tag) => tag.name.replace('hc-binaries-', ''));
    if (!binaryTagHcVersions.includes(latestHcVersion)) {
      console.log(latestHcVersion);
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