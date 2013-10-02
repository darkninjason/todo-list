release:
	git subtree split --prefix agency-ui-foundation -b release
	git checkout master
	git merge -s subtree --no-commit --squash release
	git branch -D release
