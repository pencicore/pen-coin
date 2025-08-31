package main

import (
	"web3-server/internal/listen"
	"web3-server/internal/server"
	"web3-server/internal/start"
)

func main() {
	r := server.SetupRouter()
	listen.Listen()
	start.Start()
	err := r.Run(":8080")
	if err != nil {
		return
	}
}
