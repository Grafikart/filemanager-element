.PHONY: build
build:
	pnpm run build
	cp dist/FileManager.js /home/jonathan/Sites/Boxraiser/Kumquat/nova-components/Editor/resources/js/components/FileManager.js
	cp dist/style.css /home/jonathan/Sites/Boxraiser/Kumquat/nova-components/Editor/resources/sass/field.scss
