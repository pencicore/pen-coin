package utils

import "time"

func ParseDateTime(dateStr string) (time.Time, error) {
	// 时间模板，Go 固定写法
	layout := "2006-01-02 15:04:05"

	// 加载时区
	loc, err := time.LoadLocation("Asia/Shanghai")
	if err != nil {
		return time.Time{}, err
	}

	// 按模板解析
	return time.ParseInLocation(layout, dateStr, loc)
}
