From b2b-msdp-registry.cn-shanghai.cr.aliyuncs.com/nginx/nginx:latest
RUN rm /etc/nginx/conf.d/default.conf
COPY msdp/ /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/nginx.conf 
COPY msdp/static /usr/share/nginx/html/
#设置时区
RUN rm -f /etc/localtime \
&& ln -sv /usr/share/zoneinfo/Asia/Shanghai /etc/localtime \
&& echo "Asia/Shanghai" > /etc/timezone \
