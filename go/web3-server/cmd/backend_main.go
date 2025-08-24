package main

import "web3-server/internal/server"

func main() {
	r := server.SetupRouter()
	err := r.Run(":8080")
	if err != nil {
		return
	}
}
