from app import app  # 从 app.py 文件中导入名为 app 的 Flask 应用实例

if __name__ == "__main__":  # 这是一个条件判断语句，用于确定当前脚本是否作为主程序运行
    # 只有当 main.py 文件被直接执行时，才会执行以下代码
    app.run(host="0.0.0.0", port=5000, debug=True)  # 启动 Flask 应用
    # host="0.0.0.0" 表示监听所有可用的网络接口，使得应用可以从任何 IP 地址访问
    # port=5000 表示应用监听的端口号为 5000
    # debug=True 表示开启调试模式，方便在开发过程中调试应用，当代码发生更改时，服务器会自动重启