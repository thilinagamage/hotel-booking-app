output "alb_dns_name" { value = aws_lb.app.dns_name }
output "alb_zone_id"  { value = aws_lb.app.zone_id }
output "asg_name"     { value = aws_autoscaling_group.app.name }
output "launch_template_id" { value = aws_launch_template.app.id }
