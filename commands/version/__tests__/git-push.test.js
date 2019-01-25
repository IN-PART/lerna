"use strict";

const execa = require("execa");
const pMapSeries = require("p-map-series");
const cloneFixture = require("@lerna-test/clone-fixture")(__dirname);
const gitPush = require("../lib/git-push");

test("gitPush", async () => {
  const { cwd } = await cloneFixture("root-manifest-only");

  const tags = ["v1.2.3", "foo@2.3.1", "bar@3.2.1", "baz@1.2.1", "quux@0.3.1"];

  await execa("git", ["commit", "--allow-empty", "-m", "change"], { cwd });
  await pMapSeries(tags, tag => execa("git", ["tag", tag, "-m", tag], { cwd }));

  await gitPush("origin", "master", tags, { cwd });

  const list = await execa.stdout("git", ["ls-remote", "--tags", "--refs", "--quiet"], { cwd });

  tags.forEach(tag => expect(list).toMatch(tag));
});
