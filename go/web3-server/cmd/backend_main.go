package main

import (
	"web3-server/internal/listen"
	"web3-server/internal/server"
)

func main() {
	r := server.SetupRouter()
	listen.Listen()
	err := r.Run(":8080")
	if err != nil {
		return
	}
}
