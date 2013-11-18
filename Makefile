release:
	git subtree split --prefix agency-ui-foundation -b release
	git checkout master
	git merge -s subtree --no-commit --squash release
	git branch -D release

css:
	compass watch ./static/css --poll -c ./static/css/config.rb