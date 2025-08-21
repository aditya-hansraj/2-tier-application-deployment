output "vpc_id" {
  description = "The ID of the created VPC"
  value       = aws_vpc.public.id
}

output "vpc_cidr" {
  description = "The CIDR block of the created VPC"
  value       = aws_vpc.public.cidr_block
}

output "public_subnet_id" {
  description = "The ID of the public subnet"
  value       = aws_subnet.public.id
}

output "private_subnet_id" {
  description = "The ID of the private subnet"
  value       = aws_subnet.private.id
}

output "internet_gateway_id" {
  description = "The ID of the internet gateway"
  value       = aws_internet_gateway.internet_gateway.id
}

output "public_route_table_id" {
  description = "The ID of the public route table"
  value       = aws_route_table.public.id
}

output "public_rtb_association_id" {
  description = "The ID of the public route table association"
  value       = aws_route_table_association.public.id
}

output "frontend_instance_id" {
  description = "The ID of the frontend EC2 instance"
  value       = aws_instance.frontend.id
}

output "backend_instance_id" {
  description = "The ID of the backend EC2 instance"
  value       = aws_instance.backend.id
}

output "frontend_instance_public_ip" {
  description = "The public IP of the frontend instance"
  value       = aws_instance.frontend.public_ip
}

output "frontend_instance_private_ip" {
  description = "The private IP of the frontend instance"
  value       = aws_instance.frontend.private_ip
}

output "backend_instance_private_ip" {
  description = "The private IP of the backend instance"
  value       = aws_instance.backend.private_ip
}

output "bastion_instance_id" {
  description = "The ID of the bastion EC2 instance"
  value       = aws_instance.bastion.id
}

output "bastion_instance_public_ip" {
  description = "The public IP of the bastion host"
  value       = aws_instance.bastion.public_ip
}