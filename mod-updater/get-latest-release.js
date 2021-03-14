const {Octokit} = require("@octokit/rest");

const octokit = new Octokit();

const getLatestRelease = async () => {
    let latestRelease = await octokit.request('GET /repos/{owner}/{repo}/releases/latest', {
            owner: 'PatZab',
            repo: 'Die_Anstalt_Gaming_Valheim'
        }
    );

    return latestRelease.data.tag_name;
}

module.exports = getLatestRelease;

