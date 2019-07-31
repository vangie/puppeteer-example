fetch-latest-chrome:
	docker pull adieuadieu/headless-chromium-for-aws-lambda:stable
	docker run -dt --rm --name headless-chromium adieuadieu/headless-chromium-for-aws-lambda:stable
	docker cp headless-chromium:/bin/headless-chromium ./
	docker stop headless-chromium

package-chrome: fetch-latest-chrome
	mv headless-chromium headless_shell
	tar -czvf headless_shell.tar.gz headless_shell
	rm headless_shell

upload-chrome: package-chrome
	export $$(cat .env | grep -v ^\# | xargs) && \
		ossutil cp headless_shell.tar.gz oss://fc-demo-public/fun/examples/headless_shell.tar.gz -i $$ACCESS_KEY_ID -k $$ACCESS_KEY_SECRET -e oss-cn-hangzhou.aliyuncs.com -f
