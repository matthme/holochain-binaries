import https from 'https';

const lairCrateOptions = {
  hostname: 'crates.io',
  port: 443,
  path: '/api/v1/crates/lair_keystore',
  method: 'GET',
  headers: {
    'User-Agent': 'Holochain Binaries'
  }
};

const binariesTagsOptions = {
  hostname: 'api.github.com',
  port: 443,
  // path: '/repos/matthme/holochain-binaries/tags',
  path: '/repos/pjkundert/holochain-binaries/tags',  // revert before merge!
  method: 'GET',
  headers: {
    'User-Agent': 'Holochain Binaries'
  }
}

getAndDo(lairCrateOptions, (data) => {
  const lairCrateDetails = JSON.parse(data);
  const latestLairVersion = lairCrateDetails.crate.newest_version;
  getAndDo(binariesTagsOptions, (data) => {
    const binaryTags = JSON.parse(data);
    // Check whether the latest lair_keystore crate version already has a tag in the holochain-binaries repo. If not, log it to the console
    const binaryTagLairVersions = binaryTags.filter((tag) => tag.name.includes('lair-binaries')).map((tag) => tag.name.replace('lair-binaries-', ''));
    if (!binaryTagLairVersions.includes(latestLairVersion)) {
      console.log(latestLairVersion);
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