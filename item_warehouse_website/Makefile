include .env
export

clean:
	# @$(MAKE) update-ip
	find . \( -name "node_modules" -o -name "build" -o -name "dist" -o -name ".next" \) -type d -exec rm -rf {} +

build:
	@$(MAKE) install
	@npm ci
	@npm run build

docker:
	docker-compose --verbose up --build

install:
	@npm install

update-ip:
	@new_ip=$$(ifconfig en0 | awk '/inet / {print $$2}') ; \
	sed -i '' -e "s|NEXT_PUBLIC_API_BASE_URL=http://[0-9]*\.[0-9]*\.[0-9]*\.[0-9]*:8002|NEXT_PUBLIC_API_BASE_URL=http://$$new_ip:8002|" .env


website-local:
	@$(MAKE) install
	@npm run dev

# VSCode Shortcuts #

vscode-shortcut-1:
	make website-local

vscode-shortcut-2:
	make build

vscode-shortcut-3:
	make build
	npm start

vscode-shortcut-4:
	make clean
	make build

vscode-shortcut-5:
	make docker

vscode-shortcut-6:
	@echo "Shortcut not defined"
	@exit 1

vscode-shortcut-7:
	@echo "Shortcut not defined"
	@exit 1

vscode-shortcut-8:
	@echo "Shortcut not defined"
	@exit 1

vscode-shortcut-9:
	@echo "Shortcut not defined"
	@exit 1
