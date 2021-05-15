.PHONY: build test

build:
	docker build -t test-krub .

test:
	docker run -it test-krub /bin/sh