import { execSync } from 'child_process';
import { join } from 'path';
import * as fse from 'fs-extra';
import globby from 'globby';

const commitMessage = process.env.GIT_COMMIT_MESSAGE;
const branchName = process.env.BRANCH_NAME;
const rootDir = join(__dirname, '../');

if (!branchName) {
  throw new Error('Only support publish in GitHub Actions env');
}

(async () => {
  
})().then(err => {
  console.error(err);
  process.exit(1);
})

async function publishPackage(packageDir: string) {
  const pkgPath = join(packageDir, 'package.json');
  const pkgData = await fse.readJSON(pkgPath);
  const { version, name } = pkgData;

  const npmTag = branchName === 'master' ? 'latest' : 'beta';

  if (version === 'latest') {
    return;
  }

  const versionExist = await checkVersionExist(name, version, 'https://registry.npmjs.org/');
  if (versionExist) {
    console.log(`${name}@${version} 已存在，无需发布。`);
    return;
  }

  const isProdVersion = /^\d+\.\d+\.\d+$/.test(version);
  if (branchName === 'master' && !isProdVersion) {
    throw new Error(`禁止在 master 分支发布非正式版本 ${version} ${name}`);
  }
}