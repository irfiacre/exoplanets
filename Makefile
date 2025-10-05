frontend-install:
	npm install

backend-install:
	python3 venv -m venv && source venv/bin/activate && pip install ${PWD}/requirements.txt

dev:
	make dev-backend & make dev-frontend

dev-backend:
	source venv/bin/activate && adk api_server --allow_origins="*"

dev-frontend:
	cd ${PWD}/frontend && npm run dev
