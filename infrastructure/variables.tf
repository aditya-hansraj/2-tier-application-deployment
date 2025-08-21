variable "region" {
  description = "The AWS region to deploy resources in"
  type        = string
  default     = "eu-north-1"
}

variable "vpc_name" {
  description = "The name of the VPC"
  type        = string
  default     = "public_vpc"
}

variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "vpc_id" {
  description = "The ID of the VPC"
  type        = string
  default     = "vpc-xxxxxxxxx"
}

variable "public_subnet_cidr" {
  description = "CIDR block for the public subnet"
  type        = string
  default     = "10.0.1.0/24"
}

variable "private_subnet_cidr" {
  description = "CIDR block for the private subnet"
  type        = string
  default     = "10.0.2.0/24"
}

variable "availability_zone" {
  description = "AWS Availability Zone"
  type        = string
  default     = "eu-north-1a"
}

# Instances
variable "ami" {
  description = "AMI ID to use for EC2 instances"
  type        = string
  default     = "ami-042b4708b1d05f512"
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t3.micro"
}

variable "ssh_public_key" {
  description = "SSH public key contents to inject into EC2 instances"
  type        = string
  default     = "0"
}


variable "ssh_allowed_cidr" {
  description = "CIDR block to allow SSH access from"
  type        = string
  default     = "0.0.0.0/0"
}