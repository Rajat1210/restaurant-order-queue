#!/bin/bash
docker-compose up --build -d
explorer.exe http://localhost:3000
explorer.exe http://localhost:15672

